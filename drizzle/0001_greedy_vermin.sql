CREATE TABLE `devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceType` enum('sensor','gateway','verifier') NOT NULL,
	`address` varchar(64) NOT NULL,
	`stakedAmount` int NOT NULL DEFAULT 0,
	`totalEarned` int NOT NULL DEFAULT 0,
	`reputation` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `devices_id` PRIMARY KEY(`id`),
	CONSTRAINT `devices_address_unique` UNIQUE(`address`)
);
--> statement-breakpoint
CREATE TABLE `epochs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`epochNumber` int NOT NULL,
	`startTime` timestamp NOT NULL,
	`endTime` timestamp NOT NULL,
	`deviceRewardPool` int NOT NULL DEFAULT 1000,
	`verifierRewardPool` int NOT NULL DEFAULT 200,
	`totalDistributed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `epochs_id` PRIMARY KEY(`id`),
	CONSTRAINT `epochs_epochNumber_unique` UNIQUE(`epochNumber`)
);
--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deviceId` int NOT NULL,
	`epochNumber` int NOT NULL,
	`rewardAmount` int NOT NULL,
	`rewardType` enum('device','verifier','contribution') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `devices` ADD CONSTRAINT `devices_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rewards` ADD CONSTRAINT `rewards_deviceId_devices_id_fk` FOREIGN KEY (`deviceId`) REFERENCES `devices`(`id`) ON DELETE no action ON UPDATE no action;