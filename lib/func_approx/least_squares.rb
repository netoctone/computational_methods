class FuncApprox::LeastSquares

  # independ_vals [Array of Numeric]
  # depend_vals [Array of Numeric]
  # degree [Integer] - degree of polynom to find (P1(x) = a0 + a1*x)
  #
  # returns Polynomial
  def self.find_polynom independ_vals, depend_vals, degree
    raise ArgumentError if independ_vals.size != depend_vals.size
    independ_matrix = Matrix.build(depend_vals.size, degree+1) do |row, col|
      independ_vals[row] ** col
    end
    coeffs = ::LeastSquares.find_params independ_matrix, Vector[*depend_vals]
    Polynomial.new coeffs.to_a
  end

end
