"use strict";

const {response} = require("express");
const db = require("../config/db");


class LaundryOrderComplete {
    constructor(body, orderNum) {
        this.body = body;
        this.orderNum = orderNum;  
      }

    async addOrderList() {
        const orderNum = this.orderNum;
        const request = this.body.request;
        const date = this.body.date;
        const address = this.body.address;
        let querygetUserId = "SELECT U_ID FROM ORDER_LIST WHERE O_NUM = ?;";
        let querygetUser = "SELECT U_PHONE FROM USERS WHERE U_ID = ?;";
        let query = "UPDATE ORDER_LIST SET O_DAY = ?, DELEVERY_ADDRESS = ?, O_REQUEST = ?, U_PHONE =? WHERE O_NUM = ?;";

        return new Promise ((resolve, reject) => {
        db.query("USE CAPSTONE", (err, result) => {
            db.query(querygetUserId, orderNum, (err, data) => {
                if (err) reject(err);
                else {  
                    const userId = data[0].U_ID;
                        db.query(querygetUser, userId, (err, data) => {
                            if (err) reject(err);
                            else {
                                const userPhone = data[0].U_PHONE;
                                db.query(query, [date, address, request, userPhone, orderNum], (err, data) => {
                                    if (err) reject(err);
                                    else {  
                                            resolve({success : true});
                                        }
                                    });
                            }
                        })
                    }
                });
            })
        });
    }
    async addOrderCompleteList() {
        const orderNum = this.orderNum;
        let query = "INSERT INTO ORDER_COMPLETE (O_NUM, S_ID, U_ID, O_DAY, U_PHONE, O_REQUEST, DELEVERY_ADDRESS)\
        SELECT O_NUM, S_ID, U_ID, O_DAY, U_PHONE, O_REQUEST, DELEVERY_ADDRESS\
        FROM ORDER_LIST\
        WHERE O_NUM = ?;";
        let query1 = "UPDATE ORDER_COMPLETE SET DELEVERY_STATE = ? WHERE O_NUM = ?;";

        return new Promise ((resolve, reject) => {
        db.query("USE CAPSTONE", (err, result) => {
            db.query(query, orderNum, (err, data) => {
                if (err) reject(err);
                else {  
                        db.query(query1, [0, orderNum], (err, data) => {
                            if (err) reject(err);
                            else {
                                resolve({ success: true }); 
                            }
                        })
                    }
                });
            })
        });
    }
}




module.exports = LaundryOrderComplete; 