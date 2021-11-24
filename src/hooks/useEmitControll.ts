import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import {Socket} from 'socket.io-client';
export function useEmitControll(socket:Socket,userId:number,selectNum:number){
	useEffect(() => {
		socket.emit('controll',userId,selectNum)
	}, [selectNum]);
}
