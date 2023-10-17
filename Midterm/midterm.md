## Code Snippets
### Diamond Containers
Simple little trick of enclosing text in a diamond shape, rotating 45 degrees for outside container, and then -45 degrees for the text inside.
```html
<li class="diamond-container"><a href="gallery.html">
    <div class="diamond-shape">
    <div class="page-name">Work Gallery</div>
    </div>
</a></li>
```
```css
.diamond-shape {
*other stuff*
transform: rotate(45deg);
}

.page-name {
*other stuff*
transform: rotate(-45deg);
text-align: center;
}
```

### Simple JS toggle categories
A primitive approach of implementing toggleable gallery categories.  
Attach the image path on the category box, store all the boxes in a list, and then subscribe the onClick event to each box.  
The function simply get the image path from the box and set it to the big container.  
Learned the syntax of querying classes and a neat, convenient way of doing forEach.
```html
<div class="circle-and-boxes-wrapper">
    <div class="big-circle-image-container">
        <div class="big-circle-image-inner">
            <img id="bigCircleImage" src="img/drawNrig.GIF" />
        </div>
    </div>

    <div class="category-box" image-path="img/drawNrig.GIF">
        <p>Live2D Rig&Draw</p>
    </div>
    <div class="category-box" image-path="img/rig.GIF">
        <p>Live2D Rigging</p>
    </div>
    <div class="category-box" image-path="img/illustration-1.png">
        <p>Illustration</p>
    </div>
    <div class="category-box" image-path="img/game.GIF">
        <p>Games</p>
    </div>
</div>
```

```javascript
<script>
    // js very friendly language to get started. Luv it :3
    // but definitely want to use typescript in the future, can't bear non-explicit types...

    // Wait for the entire page to load before running any code.
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
    document.addEventListener('DOMContentLoaded', function () {
        const bigCircleImage = document.getElementById('bigCircleImage');

        // querySelectorAll returns a list of the category boxes
        // https://www.w3schools.com/jsref/met_document_queryselectorall.asp
        const categoryBoxes = document.querySelectorAll('.category-box');

        // subscribe the onClick event to each box
        // neat syntax of forEach, saves a bit work: 
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
        categoryBoxes.forEach(setupCategoryBoxClickEvent);
    });

    function setupCategoryBoxClickEvent(box) {
        box.addEventListener('click', function () {
            changeBigImageSource(box);
        });
    }

    // set the big image source to the path set in the box
    function changeBigImageSource(box) {
        const newImgSrc = box.getAttribute('image-path');
        bigCircleImage.src = newImgSrc;
    }
</script>
```

## Future Plans
* Solve the layout issue in main page gallery so images can have proper transition when hovered.
* Allow the content of work gallery to loop among multiple contents within each category, and better transition when toggling categories.
* Make the calculator work!!! Most important work and should be a lot of fun.
* Maybe implementing some third party or js tricks library to optimize the gallery browsing or the whole website in general.
