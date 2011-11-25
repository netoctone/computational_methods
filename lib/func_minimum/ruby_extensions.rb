class Proc

  def memoize
    cache = {}
    lambda do |*args|
      unless cache.has_key?(args)
        cache[args] = self[*args]
      else
        cache[args]
      end
    end
  end

end
