@echo off
title OTBfO
IF EXIST node_modules (
  node index
) ELSE (
  npm install & node index
)