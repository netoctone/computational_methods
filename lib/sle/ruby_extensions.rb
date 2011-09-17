class Matrix

  def swap_rows row_ind_one, row_ind_two
    mem = self.row(row_ind_one).to_a
    self.column_size.times do |i|
      set_element(row_ind_one, i, self[row_ind_two, i])
      set_element(row_ind_two, i, mem[i])
    end
    self
  end

  def replace_row_items row_ind, &block
    row(row_ind).each_with_index do |e, i|
      set_element row_ind, i, block.call(e, i)
    end
    self
  end

end

class String

  def to_numeric
    self =~ /^-?[0-9]*(\/[0-9]*[1-9][0-9]*|\.[0-9]*)?$/
    raise StandardError, 'Not a valid numeric' unless $~

    if self['/']
      to_r
    elsif self['.']
      to_f
    else
      to_i
    end
  end

end
