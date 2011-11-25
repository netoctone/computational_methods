class FuncMinimum::Fibonacci

  FIB = lambda { |ind| ind <= 2 ? 1 : FIB[ind-1] + FIB[ind-2] }.memoize

  def self.find func, left, right, stepnum
    weight = (right-left)/FIB[stepnum+2]

    limits = [left, right]
    args = [ left + FIB[stepnum]*weight, right - FIB[stepnum]*weight ]
    vals = [func[args[0]], func[args[1]]]
    (1...stepnum).reverse_each do |ind|
      if vals[0] > vals[1]
        limits[0] = args[0]
        args[0], vals[0] = args[1], vals[1]
        args[1] = limits[0] + FIB[ind+1]*weight
        vals[1] = func[args[1]]
      else
        limits[1] = args[1]
        args[1], vals[1] = args[0], vals[0]
        args[0] = limits[0] + FIB[ind]*weight
        vals[0] = func[args[0]]
      end
    end
    args[0]
  end

end
