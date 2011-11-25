require 'func_minimum/ruby_extensions'

module FuncMinimum
  require 'func_minimum/fibonacci'

  # direction of search depends on start and limit relative position
  # function supposed to desrease in that direction before start position
  # step supposed to be absolute value
  def self.find_first_area func, start, limit, step
    allowed, delta = if start < limit
      [ lambda { |arg| arg <= limit }, step ]
    else
      [ lambda { |arg| arg >= limit }, -step ]
    end

    arg, val = start, func[start]

    loop do
      arg += delta
      return unless allowed[arg]

      new_val = func[arg]
      break [arg, arg-2*delta].sort if new_val > val
      val = new_val
    end
  end

end
