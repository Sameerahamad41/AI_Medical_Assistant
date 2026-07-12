@ECHO OFF
:: Maven Wrapper — uses locally cached Maven 3.9.11
SET "MVN=C:\Users\samee\.m2\wrapper\dists\apache-maven-3.9.11-bin\6mqf5t809d9geo83kj4ttckcbc\apache-maven-3.9.11\bin\mvn.cmd"

IF NOT EXIST "%MVN%" (
    ECHO Maven not found at expected path. Please install Maven and add it to PATH.
    ECHO Expected: %MVN%
    EXIT /B 1
)

CALL "%MVN%" %*
