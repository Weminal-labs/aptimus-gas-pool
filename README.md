# Aptimus Gas Pool

Aptimus Gas Pool is a service designed to facilitate large-scale sponsored transactions on Aptimus. It manages a database of gas coins owned by a sponsor address and offers APIs to reserve and use these coins for transaction payments. By maintaining a substantial pool of gas coin objects, the service ensures scalability and high throughput, allowing it to sponsor numerous transactions simultaneously.​

## User Flow

A typical flow for interacting with the gas pool service works as follows:

1.	The app or client prepares a transaction without gas payment and sends it to an internal server.
2.	The internal server communicates with the gas pool service to reserve gas coins for the budget specified in the transaction.
3.	The gas pool reserves the required gas coins and returns them to the internal server.
4.	The internal server sends the complete transaction back to the app or client.
5.	The app or client prompts the user to sign the transaction and then sends the signed transaction back to the internal server.
6.	The internal server forwards the signed transaction to the gas pool service for execution.
7.	The gas pool service executes the transaction via a fullnode, returns the transaction results to the internal server, which then forwards them to the app or client. The used gas coins are released and made available for future reservations.

## Architecture
Coming soon...
