<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class CheapFlights extends CI_Controller {

	public function _remap(){

		$this->index();
	}

	public function index()
	{
		$params 		= explode('/', $_SERVER['REQUEST_URI']);

		$from 			= !empty($params[2]) ? $params[2] : '';
		$to 			= !empty($params[3]) ? $params[3] : '';
		$start_date 	= !empty($params[4]) ? $params[4] : '';
		$end_date 		= !empty($params[5]) ? $params[5] : '';
		$max_price 		= !empty($params[6]) ? $params[6] : '';

		echo file_get_contents("http://ryanair-test.herokuapp.com/api/cheap-flights/$from/$to/$start_date/$end_date/$max_price");
	}

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */