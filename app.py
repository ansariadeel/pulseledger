import os
from flask import Flask, render_template, redirect, url_for
from flask_login import LoginManager, login_required
from flask_bcrypt import Bcrypt
from flask_cors import CORS