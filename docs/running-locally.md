# Running locally

To run the web app locally you will need this repo and the backend, yochess-engine cloned.

## Prerequisites

- `npm` package manager installed

## Steps to run

1. Clone this repo.
2. Clone the backend [yochess-engine](https://github.com/yordan-g/yochess-engine).
3. Run the backend [instructions here](https://github.com/yordan-g/yochess-engine).
4. Run the frontend.
   - create `.env` file from the `.env.example` and populate the needed values. `PUBLIC_WS_BASE_URL` is the endpoint of the websocket url in the backend.
   - run `npm run dev`, app usually start at - `http://localhost:5173/`.
5. Open one normal browser window for player 1 and a second in incognito for player 2.
