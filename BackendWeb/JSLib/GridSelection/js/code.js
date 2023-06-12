// Generate dom elements
let val = [];
let water_M = [11,12,1,2,3,4,5,6,7,8,9,10]
const boxes = [
    ['.box-wrap.boxes.blue', 52]
];

for (const [sel, items] of boxes) {
    const container = document.querySelector(sel);

    for (let i = 0; i < items; i++) {
        let elem
        container.appendChild(
            elem = document.createElement('div')
        );
        if (i == 0) {
            elem.className = "zero-position x-header y-header";
        } else if (i >= 1 && i <= 12) {
            elem.className = "x-header";
            elem.innerText = water_M[i-1] + '月';
        } else if (i == 13 || i == 26 || i == 39) {
            elem.className = "y-header";
            if (i === 13) elem.innerText = '上旬';
            if (i === 26) elem.innerText = '中旬';
            if (i === 39) elem.innerText = '下旬';
        } else {
            elem.className = "TenDay";
            elem.setAttribute("Qval", 'Q80');
            if (i >= 14 && i <= 25) {
                let index = 1 + (i - 14) * 3;
                let TendayId = (index - 6) <= 0 ? (index - 6) + 36 : (index - 6);
                elem.setAttribute("TendayId", TendayId);
            } else if (i >= 27 && i <= 38) {
                let index = 2 + (i - 27) * 3;
                let TendayId = (index - 6) <= 0 ? (index - 6) + 36 : (index - 6);
                elem.setAttribute("TendayId", TendayId);
            } else if (i >= 40)
                let index = 3 + (i - 40) * 3;
                let TendayId = (index - 6) <= 0 ? (index - 6) + 36 : (index - 6);
            elem.setAttribute("TendayId", TendayId);
        }
    }
}

// Initialize selectionjs
const selection = Selection.create({

    // Class for the selection-area
    class: 'selection',

    // All elements in this container can be selected
    selectables: ['.box-wrap > div'],

    // The container is also the boundary in this case
    boundaries: ['.box-wrap']
}).on('start', ({ inst, selected, oe }) => {

    // Remove class if the user isn't pressing the control key or ⌘ key
    if (!oe.ctrlKey && !oe.metaKey) {

        // Unselect all elements
        for (const el of selected) {
            //el.classList.remove('selected');
            //$(el).text('');
            inst.removeFromSelection(el);
        }

        // Clear previous selection
        inst.clearSelection();
    }

}).on('move', ({ changed: { removed, added } }) => {

    // Add a custom class to the elements that where selected.
    for (const el of added) {

        console.log(el);
        if (!$(el).hasClass('zero-position') && !$(el).hasClass('x-header') && !$(el).hasClass('y-header')) {
            //console.log($('#QvalSelection').val());
            el.classList.remove(...el.classList);
            el.classList.add('TenDay');
            el.classList.add('selected');
            el.classList.add($('#QvalSelection').val());
            el.setAttribute("Qval", $('#QvalSelection').val());
            $(el).text($('#QvalSelection').val());
        }

    }

    // Remove the class from elements that where removed
    // since the last selection
    for (const el of removed) {
        if (!$(el).hasClass('zero-position') && !$(el).hasClass('x-header') && !$(el).hasClass('y-header')) {
            el.classList.remove(...el.classList);
            el.classList.add('TenDay');
            el.setAttribute("Qval", 'Q80');
            $(el).text('');
        }
    }

}).on('stop', ({ inst }) => {
    inst.keepSelection();
    });

function getGridSelectionVal(domin) {
    //console.log(domin.find('.TenDay'));
    let sorted_elem;
    let valArry = [];
    sorted_elem = domin.find('.TenDay').sort(function (a, b) {
        //console.log($(a).attr('tendayid'), $(b).attr('tendayid'));
        return $(a).attr('tendayid') - $(b).attr('tendayid');
    });
    //console.log(sorted_elem)
    for (let i = 0; i < sorted_elem.length; i++) {
        //console.log(sorted_elem[i].attributes.qval.value);
        valArry.push(sorted_elem[i].attributes.qval.value);
    }
    //console.log(valArry)
    return valArry
}