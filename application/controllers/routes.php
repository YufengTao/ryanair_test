<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Routes extends CI_Controller {

	public function index()
	{

		echo file_get_contents('http://ryanair-test.herokuapp.com/api/routes');
	}

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */