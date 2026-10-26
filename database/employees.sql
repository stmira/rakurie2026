-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- ホスト: localhost:3306
-- 生成日時: 2026-10-26 01:51:01
-- サーバのバージョン： 5.7.24
-- PHP のバージョン: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `rakurakku`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `employees`
--

CREATE TABLE `employees` (
  `employee_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employee_id` int(11) NOT NULL,
  `department_name` char(3) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `employees`
--

INSERT INTO `employees` (`employee_name`, `password_hash`, `email`, `employee_id`, `department_name`) VALUES
('田中 太郎', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'tanaka@example.jp', 1, '生産部'),
('佐藤 花子', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'sato@example.jp', 2, '生産部'),
('鈴木 一郎', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'suzuki@example.jp', 3, '生産部'),
('高橋 美咲', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'takahashi@example.jp', 4, '生産部'),
('伊藤 健太', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'ito@example.jp', 5, '生産部'),
('渡辺 直子', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'watanabe@example.jp', 6, '営業部'),
('山本 翔太', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'yamamoto@example.jp', 7, '営業部'),
('中村 由紀', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'nakamura@example.jp', 8, '営業部'),
('小林 誠', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee09@example.invalid', 9, '生産部'),
('加藤 亮', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee10@example.invalid', 10, '生産部'),
('吉田 健', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee11@example.invalid', 11, '生産部'),
('山田 美奈', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee12@example.invalid', 12, '生産部'),
('斎藤 拓也', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee13@example.invalid', 13, '生産部'),
('井上 由美', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee14@example.invalid', 14, '生産部'),
('木村 直人', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee15@example.invalid', 15, '営業部'),
('林 恵', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee16@example.invalid', 16, '営業部'),
('清水 大輔', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee17@example.invalid', 17, '営業部'),
('森 彩', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee18@example.invalid', 18, '営業部'),
('池田 浩', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee19@example.invalid', 19, '営業部'),
('橋本 玲子', '$2y$12$H22llXpuCkr7rtJV6Xj/v.qDrtu5Banwt1is10nxuOuPe7RWVU8v6', 'employee20@example.invalid', 20, '営業部');

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

$ git push
fatal: The current branch matsuura has no upstream branch.
To push the current branch and set the remote as upstream, use

git push --set-upstream origin matsuura
To have this happen automatically for branches without a tracking
upstream, see 'push.autoSetupRemote' in 'git help config'.

解説してください

10:59
このエラーは、現在のブランチ matsuura が、リモートのどのブランチへ push するか設定されていないという意味です。

案内どおり、次のコマンドを実行すると origin に matsuura ブランチを作成して push し、以後の push/pull の追跡先として登録します。

