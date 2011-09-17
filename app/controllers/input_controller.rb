class InputController < ApplicationController

  # GET /
  # GET /input/index
  def index
  end

  # PUT /input/solve_sle.json
  def solve_sle
    coeffs, free = JSON.parse(params[:coeffs]), JSON.parse(params[:free])
    respond_to do |format|
      format.json do
        begin
          r = SLE::Gauss.solve SLE::System.new Matrix[*coeffs], Vector[*free]
          render :json => {
            :success => true,
            :roots => r.map(&:to_s)
          }
        rescue => e
          render :json => {
            :success => false,
            :errormsg => e.message
          }
        end
      end
    end
  end

end
