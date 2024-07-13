-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slack_user_id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "ssh_public_key" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_approved" BOOLEAN DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "users_slack_user_id_key" ON "users"("slack_user_id");
