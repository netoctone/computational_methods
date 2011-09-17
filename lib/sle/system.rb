module SLE

  class System

    def initialize coeff_matrix, free_vector
      raise ArgumentError, 'matrix must be square' unless coeff_matrix.square?
      if coeff_matrix.row_size != free_vector.size
        raise ArgumentError, 'matrix size must equal vector size'
      end

      string_with_rational = lambda do |s|
        s.is_a? String and s.to_numeric.is_a? Rational
      end

      no_rationals = coeff_matrix.none? &string_with_rational
      no_rationals &&= free_vector.none? &string_with_rational

      if no_rationals
        @coeffs = coeff_matrix.map &:to_f
        @free = free_vector.map &:to_f
      else
        @coeffs = coeff_matrix.map &:to_r
        @free = free_vector.map &:to_r
      end
    end

    attr_reader :coeffs, :free

    def size
      @free.size
    end

    def swap_rows row_ind_one, row_ind_two
      @coeffs.swap_rows row_ind_one, row_ind_two
      mem = @free[row_ind_one]
      @free.send :set_element, row_ind_one, @free[row_ind_two]
      @free.send :set_element, row_ind_two, mem
      self
    end

    def replace_row_items row_ind, &block
      @coeffs.replace_row_items row_ind, &block
      @free.send :set_element, row_ind, block.call(@free[row_ind], size)
      self
    end

  end

end
