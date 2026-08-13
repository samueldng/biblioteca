-- CreateIndex
CREATE INDEX "Loan_status_returnedAt_idx" ON "Loan"("status", "returnedAt");
