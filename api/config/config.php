<?php

session_start();

unset($CFG);

global $CFG;

$CFG = new stdClass();
$CFG->wwwroot = '/SQL_Panel/api';