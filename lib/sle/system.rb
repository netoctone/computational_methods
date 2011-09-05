module SLE

  class System

    def initialize coeff_matrix, free_vector
      raise ArgumentError, 'matrix must be square' unless coeff_matrix.square?
      if coeff_matrix.row_size != free_vector.size
        raise ArgumentError, 'matrix size must equal vector size'
      end

      @coeffs = coeff_matrix
      @free = free_vector
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
