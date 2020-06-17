#!/bin/bash

# see https://devcenter.heroku.com/articles/heroku-cli
heroku login
heroku git:remote -a rating-history -r heroku
