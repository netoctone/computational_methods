class FuncApprox::Newton

  def self.find_polynom independ_vals, depend_vals
    raise ArgumentError if independ_vals.size != depend_vals.size

    improve_precision = lambda { |x| Integer === x ? x.to_f : x }
    independ_vals.map! &improve_precision
    depend_vals.map! &improve_precision

    diffs = depend_vals.dup # divided differencies
    (1...diffs.size).each do |start_ind|
      subtr_coeff = diffs[start_ind-1]
      subtr_indep = independ_vals[start_ind-1]
      (start_ind...diffs.size).each do |cur_ind|
        diffs[cur_ind] = (diffs[cur_ind] - subtr_coeff) /
                          (independ_vals[cur_ind] - subtr_indep)
      end
    end

    p diffs

    growing_poly_coeffs = [1]
    coeffs = diffs.dup
    (1...diffs.size).map do |diff_ind|
      cur_diff, cur_indep = diffs[diff_ind], independ_vals[diff_ind-1]
      growing_poly_coeffs.unshift 0
      (0...growing_poly_coeffs.size-1).each do |i|
        growing_poly_coeffs[i] -= growing_poly_coeffs[i+1]*cur_indep
      end
      (0...growing_poly_coeffs.size-1).each do |i|
        coeffs[i] += growing_poly_coeffs[i]*cur_diff
      end
    end

    Polynomial.new coeffs
  end

end
