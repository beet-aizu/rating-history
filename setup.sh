#!/bin/bash
heroku login
heroku git:remote -a rating-history -r heroku
