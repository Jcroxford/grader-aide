#!/bin/bash

docker run --name grader-aide-db -d --rm -v ~/data:/data/db -p 27017:27017 mongo
