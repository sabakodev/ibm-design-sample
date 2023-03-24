<?php
/**
 * Reonomic Controller
 *
 * @author Fray117
 */

require_once("config.php");

$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if (isset($_GET['products'])) {
	if ($db->query("SHOW TABLES LIKE 'products'")) {
		if (isset($_GET['insert'])) {
			$newProducts = "INSERT INTO `products` (`id`, `sku`, `name`, `price`, `picture`, `orders`, `time`) VALUES (NULL, '01010001', 'Caffè Latte', '7', 'src/assets/images/product/coffee/latte.jpg', '0', CURRENT_TIMESTAMP) ";
		} else {
			$d = $db->query("SELECT * FROM `reonomic`.`products`");
			while ($r = $d->fetch_assoc) {
				$a[] = $r;
			}
		
			echo json_encode($a);
		}
	} else {
		$db->query("CREATE TABLE `reonomic`.`products` ( `id` INT NOT NULL AUTO_INCREMENT , `sku` INT NOT NULL , `name` TEXT NOT NULL , `price` INT NOT NULL , `picture` TEXT NOT NULL , `orders` INT NOT NULL , `time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`), UNIQUE `unit` (`sku`)) ENGINE = InnoDB");
	}
}