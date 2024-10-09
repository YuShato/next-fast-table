-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "userNumber" TEXT,
    "userYear" TEXT,
    "userCity" TEXT,
    "userName" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
