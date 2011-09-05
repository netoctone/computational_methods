module SLE

  module Gauss

    class << self

      # mutator method
      def solve system
        forward system
        backward system
      end

      private

      # mutator method
      def forward sys
        sys.size.times do |diag_ind|
          row_ind_with_max = (diag_ind...sys.size).inject do |mem, cur|
            if sys.coeffs[mem, diag_ind].abs < sys.coeffs[cur, diag_ind].abs
              mem = cur_i
            end
            mem
          end
          sys.swap_rows diag_ind, row_ind_with_max

          diag_row = sys.coeffs.row diag_ind
          diag = sys.coeffs[diag_ind, diag_ind]

          (diag_ind+1...sys.size).each do |i|
            div = sys.coeffs[i, diag_ind]
            if div != 0
              sys.replace_row_items(i) { |e,| e/div*diag }
              sys.coeffs.replace_row_items(i) { |e, i| e - diag_row[i] }
              sys.free.send :set_element, i, sys.free[i] - sys.free[diag_ind]
            end
          end
        end
      end

      def backward sys
        roots = Array.new sys.size
        (0...sys.size).to_a.reverse.each do |diag_ind|
          sum = (diag_ind+1...sys.size).inject(0) do |mem, i|
            mem + sys.coeffs[diag_ind, i]*roots[i]
          end
          right = sys.free[diag_ind] - sum
          roots[diag_ind] = right / sys.coeffs[diag_ind, diag_ind]
        end
        roots
      end

    end

  end

end
