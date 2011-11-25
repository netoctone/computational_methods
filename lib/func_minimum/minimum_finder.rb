module FuncMinimum

  class MinimumFinder

    def initialize precise_method, *method_args
      @precise_meth, @meth_args = precise_method, method_args
    end

    DIRECTION_DETERMINE_STEP_PART = 100

    def find func, left, right, step, start
      dir_determ = step / DIRECTION_DETERMINE_STEP_PART
      limit = func[start+dir_determ] < func[start-dir_determ] ? right : left
      area = FuncMinimum.find_first_area(func, start, limit, step)

      @precise_meth.find(func, *area, *@meth_args) || start
    end

  end

end
