GET CONNECTION FROM THE LOCAL POOL
SET foreign_key_checks = 0
CREATE TABLE `address` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `state` VARCHAR(30) NOT NULL,
  `city` VARCHAR(30) NOT NULL,
  `region` VARCHAR(30) NOT NULL,
  `postcode` INTEGER NOT NULL
)

CREATE TABLE `center` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(50) NOT NULL,
  `address` INTEGER NOT NULL
)

CREATE INDEX `idx_center__address` ON `center` (`address`)

ALTER TABLE `center` ADD CONSTRAINT `fk_center__address` FOREIGN KEY (`address`) REFERENCES `address` (`id`)

CREATE TABLE `name` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `first` VARCHAR(25) NOT NULL,
  `middle` VARCHAR(25),
  `last` VARCHAR(25) NOT NULL,
  `nick` VARCHAR(25)
)

CREATE TABLE `vaccine` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL
)

CREATE TABLE `center_vaccine` (
  `center` INTEGER NOT NULL,
  `vaccine` INTEGER NOT NULL,
  PRIMARY KEY (`center`, `vaccine`)
)

CREATE INDEX `idx_center_vaccine` ON `center_vaccine` (`vaccine`)

ALTER TABLE `center_vaccine` ADD CONSTRAINT `fk_center_vaccine__center` FOREIGN KEY (`center`) REFERENCES `center` (`id`)

ALTER TABLE `center_vaccine` ADD CONSTRAINT `fk_center_vaccine__vaccine` FOREIGN KEY (`vaccine`) REFERENCES `vaccine` (`id`)

CREATE TABLE `dose` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `dab` INTEGER NOT NULL,
  `vaccine` INTEGER NOT NULL
)

CREATE INDEX `idx_dose__vaccine` ON `dose` (`vaccine`)

ALTER TABLE `dose` ADD CONSTRAINT `fk_dose__vaccine` FOREIGN KEY (`vaccine`) REFERENCES `vaccine` (`id`)

CREATE TABLE `user` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `uname` VARCHAR(35) UNIQUE NOT NULL,
  `email` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(25) NOT NULL,
  `confirmed` BOOLEAN NOT NULL,
  `access` INTEGER,
  `name` INTEGER NOT NULL,
  `address` INTEGER NOT NULL,
  `avatar` INTEGER NOT NULL
)

CREATE INDEX `idx_user__address` ON `user` (`address`)

CREATE INDEX `idx_user__avatar` ON `user` (`avatar`)

CREATE INDEX `idx_user__name` ON `user` (`name`)

ALTER TABLE `user` ADD CONSTRAINT `fk_user__address` FOREIGN KEY (`address`) REFERENCES `address` (`id`)

ALTER TABLE `user` ADD CONSTRAINT `fk_user__name` FOREIGN KEY (`name`) REFERENCES `name` (`id`)

CREATE TABLE `phone` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `user` INTEGER NOT NULL,
  `ccode` VARCHAR(7),
  `number` VARCHAR(20) UNIQUE NOT NULL,
  `confirmed` BOOLEAN NOT NULL,
  `center` INTEGER NOT NULL
)

CREATE INDEX `idx_phone__center` ON `phone` (`center`)

CREATE INDEX `idx_phone__user` ON `phone` (`user`)

ALTER TABLE `phone` ADD CONSTRAINT `fk_phone__center` FOREIGN KEY (`center`) REFERENCES `center` (`id`)

ALTER TABLE `phone` ADD CONSTRAINT `fk_phone__user` FOREIGN KEY (`user`) REFERENCES `user` (`id`)

CREATE TABLE `image` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `photo` LONGBLOB NOT NULL,
  `vaccine` INTEGER NOT NULL,
  `center` INTEGER NOT NULL,
  `user` INTEGER NOT NULL,
  `child` INTEGER NOT NULL
)

CREATE INDEX `idx_image__center` ON `image` (`center`)

CREATE INDEX `idx_image__child` ON `image` (`child`)

CREATE INDEX `idx_image__user` ON `image` (`user`)

CREATE INDEX `idx_image__vaccine` ON `image` (`vaccine`)

ALTER TABLE `image` ADD CONSTRAINT `fk_image__center` FOREIGN KEY (`center`) REFERENCES `center` (`id`)

ALTER TABLE `image` ADD CONSTRAINT `fk_image__user` FOREIGN KEY (`user`) REFERENCES `user` (`id`)

ALTER TABLE `image` ADD CONSTRAINT `fk_image__vaccine` FOREIGN KEY (`vaccine`) REFERENCES `vaccine` (`id`)

ALTER TABLE `user` ADD CONSTRAINT `fk_user__avatar` FOREIGN KEY (`avatar`) REFERENCES `image` (`id`)

CREATE TABLE `child` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `dob` DATETIME NOT NULL,
  `user` INTEGER NOT NULL,
  `name` INTEGER NOT NULL,
  `height` DECIMAL(12, 2),
  `weight` DECIMAL(12, 2),
  `avatar` INTEGER NOT NULL,
  `address` INTEGER NOT NULL
)

CREATE INDEX `idx_child__address` ON `child` (`address`)

CREATE INDEX `idx_child__avatar` ON `child` (`avatar`)

CREATE INDEX `idx_child__name` ON `child` (`name`)

CREATE INDEX `idx_child__user` ON `child` (`user`)

ALTER TABLE `child` ADD CONSTRAINT `fk_child__address` FOREIGN KEY (`address`) REFERENCES `address` (`id`)

ALTER TABLE `child` ADD CONSTRAINT `fk_child__avatar` FOREIGN KEY (`avatar`) REFERENCES `image` (`id`)

ALTER TABLE `child` ADD CONSTRAINT `fk_child__name` FOREIGN KEY (`name`) REFERENCES `name` (`id`)

ALTER TABLE `child` ADD CONSTRAINT `fk_child__user` FOREIGN KEY (`user`) REFERENCES `user` (`id`)

ALTER TABLE `image` ADD CONSTRAINT `fk_image__child` FOREIGN KEY (`child`) REFERENCES `child` (`id`)

SELECT `address`.`id`, `address`.`state`, `address`.`city`, `address`.`region`, `address`.`postcode`
FROM `address` `address`
WHERE 0 = 1

SELECT `center`.`id`, `center`.`title`, `center`.`address`
FROM `center` `center`
WHERE 0 = 1

SELECT `center_vaccine`.`center`, `center_vaccine`.`vaccine`
FROM `center_vaccine` `center_vaccine`
WHERE 0 = 1

SELECT `child`.`id`, `child`.`dob`, `child`.`user`, `child`.`name`, `child`.`height`, `child`.`weight`, `child`.`avatar`, `child`.`address`
FROM `child` `child`
WHERE 0 = 1

SELECT `dose`.`id`, `dose`.`dab`, `dose`.`vaccine`
FROM `dose` `dose`
WHERE 0 = 1

SELECT `image`.`id`, `image`.`photo`, `image`.`vaccine`, `image`.`center`, `image`.`user`, `image`.`child`
FROM `image` `image`
WHERE 0 = 1

SELECT `name`.`id`, `name`.`first`, `name`.`middle`, `name`.`last`, `name`.`nick`
FROM `name` `name`
WHERE 0 = 1

SELECT `phone`.`id`, `phone`.`user`, `phone`.`ccode`, `phone`.`number`, `phone`.`confirmed`, `phone`.`center`
FROM `phone` `phone`
WHERE 0 = 1

SELECT `user`.`id`, `user`.`uname`, `user`.`email`, `user`.`password`, `user`.`confirmed`, `user`.`access`, `user`.`name`, `user`.`address`, `user`.`avatar`
FROM `user` `user`
WHERE 0 = 1

SELECT `vaccine`.`id`, `vaccine`.`title`
FROM `vaccine` `vaccine`
WHERE 0 = 1

COMMIT
SET foreign_key_checks = 1
CLOSE CONNECTION
