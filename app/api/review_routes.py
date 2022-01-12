from flask import Blueprint, request
from flask_login import current_user, login_required
from app.forms import ReviewForm, validation_errors_to_error_messages

from app.models import db, Review

review_routes = Blueprint('reviews', __name__)


@review_routes.route('/<int:review_id>', methods=['PUT'])
@login_required
def post_review(review_id):
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        review = Review.query.get(review_id)
        review.rating = form.data['rating']
        review.comment = form.data['comment']
        db.session.commit()
        return review.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400
