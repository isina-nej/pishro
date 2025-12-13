#!/bin/bash
cd /opt/pishro
export DATABASE_URL='mongodb://admin:admin123456@127.0.0.1:27017/pishro?authSource=admin'
export NODE_ENV='production'
npm run start
