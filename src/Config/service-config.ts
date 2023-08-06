import CallBoardServiceRest from "../Service/CallBoardServiceRest"

export const callBoardService:CallBoardServiceRest = new CallBoardServiceRest("http://localhost:3500/board");