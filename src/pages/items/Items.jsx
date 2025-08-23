import React, { use, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from "../../store/creators";

const Items = () => {
  const dispatch = useDispatch()
  const { login } = useSelector((state) => state.login)
  const { items } = useSelector((state) => state.entities.items)

  console.log('items', items)
  const data = {
    token: login.token
  }
  useEffect(() => {
    dispatch(actions.itemsGetData(data));
  }, []);
  return (
    <div>
      {items.data && items.data.map((item) => {
        return (
          <div>{item.name}</div>
        )
      })}
    </div>
  )
}

export default Items