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
          independent = Array.new(pts) { |i| left + i*dist/last_pt_ind }
          dependent = independent.map { |x| eval func }
          poly = ApproxWithPolynom.find_polynom independent, dependent, deg

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

end
