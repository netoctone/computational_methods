require 'matrix'

module LeastSquares

  # independ_matrix [Matrix]
  # depend_vect [Vector]
  def self.find_params independ_matrix, depend_vect
    raise ArgumentError if independ_matrix.row_size != depend_vect.size
    transp = independ_matrix.transpose
    (transp*independ_matrix).inverse * transp * depend_vect
  end

end
