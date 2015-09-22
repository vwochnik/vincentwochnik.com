<?php

$db_host = 'localhost';
$db_user = 'vwochnik_main';
$db_pass = 'WlpBEiXZ[**n';
$db_name = 'vwochnik_main';
$mailto = 'Vincent Wochnik <vincent@vincentwochnik.com>';

$dbh = new PDO('mysql:host=' . $db_host . ';dbname=' . $db_name,
               $db_user, $db_pass,
               array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$ip_binary = inet_pton($_SERVER['REMOTE_ADDR']);
$user_agent = substr($_SERVER['HTTP_USER_AGENT'], 0, 255);

header('Content-Type: application/json');
header("Expires: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if ($dbh->exec('DELETE FROM contact_sessions WHERE time < NOW() - 15*60') === FALSE) {
    $ret = $dbh->exec('CREATE TABLE IF NOT EXISTS contact_sessions ('
              .'id int(9) UNSIGNED NOT NULL auto_increment,'
              .'secret CHAR(32) NOT NULL,'
              .'agent VARCHAR(255) NOT NULL,'
              .'ip VARBINARY(16) NOT NULL,'
              .'time DATETIME NOT NULL,'
              .'PRIMARY KEY( id )'
              .') DEFAULT CHARACTER SET \'UTF8\'');
    if ($ret === FALSE) {
        echo json_encode(array(
            'error' => 'Database error.' 
        ));
        die();
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	$secret = md5(uniqid(rand(), true));

	$sth = $dbh->prepare('INSERT INTO contact_sessions (secret, agent, ip, time) VALUES (?, ?, ?, NOW())');
	$sth->bindValue(1, $secret, PDO::PARAM_STR);
	$sth->bindValue(2, $user_agent, PDO::PARAM_STR);
	$sth->bindValue(3, $ip_binary, PDO::PARAM_LOB);
	if ($sth->execute() === FALSE) {
        echo json_encode(array(
            'error' => 'Database error.' 
        ));
        die();
    }

    echo json_encode(array(
        'secret' => $secret,
        'expires' => gmdate('r', time()+15*60)
    ));
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = NULL;
    if ((isset($_SERVER['CONTENT_TYPE'])) &&
        (stripos($_SERVER['CONTENT_TYPE'], 'application/json') === 0))
        $data = json_decode(file_get_contents('php://input'));

    if ($data === NULL) {
        echo json_encode(array(
            'error' => 'Invalid request data.' 
        ));
        die();
    }

	$name = trim(strip_tags($data->name));
	$email = trim(strip_tags($data->email));
	$subject = trim(strip_tags($data->subject));
	$message = trim(strip_tags($data->message));
	$secret = $data->secret;

	$sth = $dbh->prepare('SELECT id FROM contact_sessions WHERE ip = ? AND agent = ? AND time >= NOW() - 15*60 AND secret = ? ORDER BY time DESC LIMIT 1');
	$sth->bindValue(1, $ip_binary, PDO::PARAM_LOB);
	$sth->bindValue(2, $user_agent, PDO::PARAM_STR);
	$sth->bindValue(3, $secret, PDO::PARAM_STR);
	$sth->execute();
    $row = $sth->fetch(PDO::FETCH_NUM);
    $sth->closeCursor();

    if ($row === FALSE) {
        echo json_encode(array(
            'error' => 'Invalid secret.' 
        ));
        die();
    }

    $sth = $dbh->prepare('DELETE FROM contact_sessions WHERE id = ?');
    $sth->bindValue(1, $row[0], PDO::PARAM_INT);
    $sth->execute();

    if ((mb_strlen($name) == 0) ||
        (!mb_eregi('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+'
				   .'(\.[a-z0-9-]+)*(\.[a-z]{2,3})$', $email)) ||
        (mb_strlen($message) == 0)) {
        echo json_encode(array(
            'error' => 'Invalid user input.' 
        ));
        die();
    }
    if (mb_strlen($subject) == 0)
        $subject = 'Contact Form';

    $text = $message
          . "\r\n\r\n--\r\nSent via contact form.\r\n"
          . 'IP address: '. $_SERVER['REMOTE_ADDR'] ."\r\n"
          . 'Time stamp: '. gmdate('r') ."\r\n"
          . 'User agent: '. $user_agent ."\r\n";
    
    $headers = 'MIME-Version: 1.0'."\r\n"
             . 'Content-type: text/plain; charset=UTF-8'."\r\n"
             . 'From: '. $name .' <'. $email .'>'."\r\n"
             . 'Reply-To: '. $name .' <'. $email .'>'."\r\n";
    $res = @mail($mailto, $subject, $text, $headers);

    if ($res) {
        echo json_encode(array(
            'success' => 'Your message has been sent.' 
        ));
        die();
    } else {
        echo json_encode(array(
            'error' => 'Mail send error.' 
        ));
        die();
    }
} else {
    die('Invalid request method.');
}

//EOF
