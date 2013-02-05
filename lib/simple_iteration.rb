class SimpleIteration

  def self.find_poly_roots poly, left, right
    find_poly_and_derivative_roots(poly, left, right)[0]
  end

  private

  def self.find_poly_and_derivative_roots poly, left, right
    deriv = poly.derivative
    if deriv.degree == 1
      extrem = -deriv.coefs[0]/deriv.coefs[1]
      extrems = (left..right).cover?(extrem) ? [extrem] : []
    else
      extrems, deriv_extrems = find_poly_and_derivative_roots deriv, left, right
    end

    prev_x, prev_val, ranges = left, poly.substitute(left), []
    [*extrems, right].each do |x|
      val = poly.substitute x
      ranges << [prev_x, x] if prev_val*val <= 0
      prev_x, prev_val = x, val
    end

    roots = ranges.map do |rng|
      reduce_range(poly, *rng)[0]
    end

    [roots, extrems]
  end

  STEP = 0.01

  def self.reduce_range poly, left, right
    return [left, right] if right-left < STEP
    prev_x, prev_val = left, poly.substitute(left)
    (left+STEP...right+STEP).step(STEP) do |x|
      val = poly.substitute x
      break [prev_x, x] if prev_val*val <= 0
      prev_x, prev_val = x, val
    end
  end

end
