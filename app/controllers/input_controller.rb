class InputController < ApplicationController

  # GET /
  # GET /input/index
  def index
  end

  # PUT /input/solve_sle.json
  def solve_sle
    coeffs, free = JSON.parse(params[:coeffs]), JSON.parse(params[:free])
    respond_to do |format|
      format.json do
        begin
          r = SLE::Gauss.solve SLE::System.new Matrix[*coeffs], Vector[*free]
          render :json => {
            :success => true,
            :roots => r.map(&:to_s)
          }
        rescue => e
          render :json => {
            :success => false,
            :errormsg => e.message
          }
        end
      end
    end
  end

  include Math

  # POST /input/approximate_func.json
  def approximate_func
    input = params[:input]

    deg = input[:degree].to_i
    func = input[:func]
    left = input[:left].to_f
    right = input[:right].to_f
    pts = input[:pts].to_i
    det_pts = input[:det_pts].to_i

    respond_to do |format|
      format.json do
        begin
          dist, last_pt_ind = right - left, pts - 1
          indep = Array.new(pts) { |i| left + i*dist/last_pt_ind }
          dependent = indep.map { |x| eval func }
          poly = FuncApprox::LeastSquares.find_polynom indep, dependent, deg

          last_det_pt_ind = det_pts - 1
          indep_det = Array.new(det_pts) { |i| left+i*dist/last_det_pt_ind }
          depend_det = indep_det.map { |x| eval func }
          approxed = indep_det.map { |x| poly.substitute x }
          inaccuracies = depend_det.zip(approxed).map { |d, a| d - a }
          render :json => {
            :success => true,
            :polynom => poly.to_s,
            :independent => indep_det,
            :dependent => depend_det,
            :approxed => approxed,
            :inaccuracies => inaccuracies
          }
        rescue => e
          render :json => {
            :success => false,
            :msg => e.message
          }
        end
      end
    end
  end

  FUNC = '4*x - 7*sin(x)'
  DERIV = '4 - 7*cos(x)'
  DERIV_2 = '7*sin(x)'

  # POST /input/derivat_integ.json
  def derivat_integ
    input = params[:input]

    left = input[:left].to_f
    right = input[:right].to_f
    step_num = input[:step_num].to_i

    dist = right - left
    step = dist / step_num
    points = [left]
    step_num.times { points << points[-1] + step }

    func = lambda { |x| eval FUNC }
    deriv = lambda { |x| eval DERIV }
    deriv_2 = lambda { |x| eval DERIV_2 }

    vals = points.map &func

    near_vals = points.map { |x| [func[x-step], func[x+step]] }
    mids = points.map{ |x| x + step/2 }
    mids.pop
    integ = step * mids.map{ |x| func[x] }.inject(&:'+')

    respond_to do |format|
      format.json do
        render :json => {
          :success => true,
          :pts => points,
          :vals => vals,
          :derivs => points.map(&deriv),
          :derivs_2 => points.map(&deriv_2),
          :approx_derivs => points.each_with_index.map { |x_mid, i|
            x_left, x_right = x_mid - step, x_mid + step
            f_left, f_mid, f_right = near_vals[i][0], vals[i], near_vals[i][1]
            (f_mid - f_left)/step +
              (x_mid - x_left)*(f_left - 2*f_mid + f_right)/(2*step**2)
          },
          :approx_derivs_2 => points.size.times.map { |i|
            f_left, f_mid, f_right = near_vals[i][0], vals[i], near_vals[i][1]
            (f_left - 2*f_mid + f_right)/(step**2)
          },
          :integ => integ
        }
      end
    end
  end

  # POST /input/nonlinear_equations.json
  def nonlinear_equations
    input = params[:input]

    function = input[:func]
    func = lambda { |x| eval function }

    rec_function = input[:rec_func]
    rec_func = lambda { |x| eval rec_function }

    left = input[:left].to_f
    right = input[:right].to_f
    step = input[:step].to_f
    eps = input[:eps].to_f

    raise StandardError if eps < 0.001 || step < 0.001

    pts_and_vals = (left..right).step(step).map do |pt|
      [pt, func[pt]]
    end
    if pts_and_vals[-1][0] != right
      pts_and_vals << [right, func[right]]
    end

    ranges = pts_and_vals.each_with_next(2).select{ |(x_l, f_l), (x_r, f_r)|
      f_l*f_r <= 0
    }.map{ |(x_l, f_l), (x_r, f_r)| [x_l, x_r] }

    roots = ranges.map do |l, r|
      pt = (l + r)/2
      loop {
        break unless (l..r).cover? pt
        new_pt = rec_func[pt]
        break new_pt if (new_pt - pt).abs < eps
        pt = new_pt
      }
    end
    roots.compact!

    respond_to do |format|
      format.json do
        render :json => {
          :success => true,
          :roots => roots
        }
      end
    end
  end

  def ordinary_differential_equations
    input = params[:input]

    deriv_u = [ input[:deriv_u1], input[:deriv_u2] ]
    u_funcs = [ input[:u1], input[:u2] ]
    u_left = [ input[:u1_left].to_f, input[:u2_left].to_f ]
    left = input[:left].to_f
    right = input[:right].to_f
    step_num = input[:step_num].to_i

    dist = right - left
    step = dist / step_num

    points = [left]
    step_num.times {
      points << points[-1] + step
    }

    u_vals = points.map do |pt|
      x = pt
      u_funcs.map do |func|
        eval func
      end
    end

    points = [left]
    u_approx_vals = [u_left]
    step_num.times {
      x = points[-1]
      u = u_approx_vals[-1]

      points << x + step
      u_approx_vals << deriv_u.zip(u).map do |deriv, u_cur|
        u_cur + step*eval(deriv)
      end
    }

    respond_to do |format|
      format.json do
        render :json => {
          :success => true,
          :pts => points,
          :u_approx_vals => u_approx_vals,
          :u_vals => u_vals
        }
      end
    end
  end

  # POST /input/multiple_minimization.json
  def multiple_minimization
    input = params[:input]

    func = input[:func]
    precision = input[:precision].to_f

    left = input[:left].to_f
    right = input[:right].to_f
    step = input[:step].to_f
    fib_iter_num = input[:fib_iter_num].to_i

    function = lambda { |x| eval func }

=begin
    # determine arguments number
    indexes_of_args, ind = [], 0
    while ind = func.index(/\[/, ind)
      ind += 1
      indexes_of_args << func[ind]
    end
    mid = (left+right)/2
    x = Array.new(indexes_of_args.uniq.size) { mid }
=end
    x = [input[:x0].to_f, input[:x1].to_f]

    finder = FuncMinimum::MinimumFinder.new(FuncMinimum::Fibonacci,
                                            fib_iter_num)
    loop do
      old_x = x.dup
      x.size.times do |ind|
        onearg_f = fix_args_except function, x, ind
        min = finder.find(onearg_f, left, right, step, x[ind]) || x[ind]
        raise NoMinimum unless min
        x[ind] = min
      end
      break if x.zip(old_x).all? { |cur, old| (cur-old).abs < precision }
    end

    respond_to do |format|
      format.json do
        render :json => {
          :success => true,
          :point => x,
          :value => function[x]
        }
      end
    end
  end

  private

  def fix_args_except func, args, except_ind
    x = args
    lambda do |arg|
      x[except_ind] = arg
      func[x]
    end
  end

end
