import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import {Socket} from 'socket.io-client';
export function useEmitControll(socket:Socket,canvasId:number,userId:number,selectNum:number){
	useEffect(() => {
		socket.emit('server-controll',canvasId,userId,selectNum)
	}, [selectNum]);
}
