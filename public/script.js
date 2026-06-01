document.addEventListener("DOMContentLoaded", function() {
    
    const urlPath = window.location.pathname;
    
    if (urlPath.includes("laptop") && urlPath.includes(".html")) {
        const laptopId = urlPath.replace("/laptop", "").replace(".html", "");
        
        fetch(`/api/laptops/${laptopId}`)
            .then(response => response.json())
            .then(laptop => {
                document.title = laptop.title + " - Details";
                document.getElementById("laptop-title").textContent = laptop.title;
                document.getElementById("laptop-short-desc").textContent = laptop.shortDescription;
                document.getElementById("laptop-full-desc").textContent = laptop.fullDescription;
                document.getElementById("laptop-price").textContent = laptop.price.toFixed(2);
                document.getElementById("laptop-image").src = laptop.image;
                document.getElementById("laptop-image").alt = laptop.title;

                document.getElementById("loading").style.display = "none";
                document.getElementById("laptop-content").style.display = "block";
            });

        fetch(`/api/reviews/${laptopId}`)
            .then(response => response.json())
            .then(reviews => {
                const container = document.getElementById("reviews-container");
                if (reviews.length > 0) {
                    container.innerHTML = "";
                    reviews.forEach(review => {
                        container.innerHTML += `<div class="review"><p><strong>Guest:</strong> ${review.comment}</p></div>`;
                    });
                }
            });
    }

    const purchaseForm = document.getElementById("purchase-form");
    if (purchaseForm) {
        purchaseForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const nameInput = document.getElementById("name").value;
            const addressInput = document.getElementById("address").value;
            const laptopId = window.location.pathname.replace("/laptop", "").replace(".html", "");
            
            fetch('/api/purchases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerName: nameInput, customerAddress: addressInput, laptopId: laptopId })
            }).then(() => {
                alert(`${nameInput}, благодарим за поръчката!`);
                purchaseForm.reset();
            });
        });
    }

    const reviewForm = document.getElementById("review-form");
    if (reviewForm) {
        reviewForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const commentInput = document.getElementById("comment").value;
            const laptopId = window.location.pathname.replace("/laptop", "").replace(".html", "");
            
            fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ laptopId: laptopId, comment: commentInput })
            }).then(() => {
                const container = document.getElementById("reviews-container");
                const noReviewsMsg = document.getElementById("no-reviews");
                if (noReviewsMsg) noReviewsMsg.style.display = 'none';

                const newReview = document.createElement("div");
                newReview.className = "review";
                newReview.innerHTML = `<p><strong>Guest:</strong> ${commentInput}</p>`;
                container.prepend(newReview);
                
                reviewForm.reset();
            });
        });
    }
});