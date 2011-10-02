class Array

  def each_with_next count
    if block_given?
      (size - count + 1).times do |i|
        yield slice(i, count)
      end
    else
      enum_for __method__, count
    end
  end

end
