import React, { use, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from "../../store/creators";

const Customers = () => {
  const dispatch = useDispatch()
  const { login } = useSelector((state) => state.login)
  const { customers } = useSelector((state) => state.entities.customers)

  console.log('customers', customers)
  const data = {
    token: login.token
  }
  useEffect(() => {
    dispatch(actions.customersGetData(data));
  }, []);
  return (
    <div>
      {customers.data && customers.data.map((item) => {
        return (
          <div>{item.name}</div>
        )
      })}
    </div>
  )
}

export default Customers