/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 100422
 Source Host           : localhost:3306
 Source Schema         : sql_panel

 Target Server Type    : MySQL
 Target Server Version : 100422
 File Encoding         : 65001

 Date: 02/05/2023 18:49:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for host
-- ----------------------------
DROP TABLE IF EXISTS `host`;
CREATE TABLE `host`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `port` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `arr_databases` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `active` int NOT NULL DEFAULT 0,
  `visible` enum('yes','no') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'yes',
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `host_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of host
-- ----------------------------
INSERT INTO `host` VALUES (7, '/zZp0yJLygp8Yhey5gG2T1q2ClNMOahaIIsyZL0=', '::1', 'dfgdfg', 'fdgdfg', 'dfgdfg', '3306', '[]', 0, 'yes', 1);
INSERT INTO `host` VALUES (8, '/zZp0yBKyQh9YS6L5gC1TVuOMVFNOqpbGOcyZ7tI', '::1', 'fgdfgdf', 'dfgdfg', 'dfgdfg', '3306', '[]', 0, 'yes', 1);
INSERT INTO `host` VALUES (14, '/zZp0ypCzg92bSen9jmgRlKdMWoYbv4L', '::1', 'localhost', 'root', '', '3306', '[]', 0, 'yes', 1);
INSERT INTO `host` VALUES (16, '/zZp0zZf2At4ZBew5AG2T1q2MQYYbfg=', '::1', 'prueba', 'dfgdfg', '', '3306', '[]', 1, 'yes', 2);
INSERT INTO `host` VALUES (17, '/zZp0zJI3hpFcS2n9jmNGg7ZWA==', '::1', 'test', 'test', '', '3306', '[]', 1, 'yes', 2);
INSERT INTO `host` VALUES (18, '/zZp0zJI3hpFcS2n9jmNGg7ZWA==', '::1', 'test', 'test', '', '3306', '[]', 1, 'yes', 2);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'default.png',
  `rol` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '[\"user\"]',
  `visible` int NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'ChemaSanchez11', 'Y2hlbWE=', 'default.png', '[\"user\"]', 0);
INSERT INTO `user` VALUES (2, 'Anita11', 'YW5pdGE=', 'default.png', '[\"user\"]', 1);

SET FOREIGN_KEY_CHECKS = 1;
