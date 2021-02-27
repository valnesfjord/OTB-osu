@echo off
title OTBfO
chcp 65001
IF EXIST node_modules (
  node index
) ELSE (
  npm install & node index
)