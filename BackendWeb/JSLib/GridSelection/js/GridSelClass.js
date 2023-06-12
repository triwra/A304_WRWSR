// Generate dom elements

class TenDaysGridSelClass {
    val = [];
    water_M = [11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    boxes;
    methodNo;
    scope;
    selection
    constructor(sel, methodNo = 1) {
        this.boxes = [
            [sel, 52]
        ];
        console.log(sel)
        this.methodNo = methodNo;
        this.scope = $(`div[caseNo = "${methodNo}"]`);
        console.log(this.boxes);
        this.creat();
        this.returnSelection();
    }

    creat() {
        //console.log(this.methodNo)
        for (const [sel, items] of this.boxes) {
            const container = this.scope.find(sel);
            //console.log(container);
            for (let i = 0; i < items; i++) {
                let elem = $('<div></div>');
                container.append(elem);
                //console.log(container);
                if (i == 0) {
                    elem.addClass("zero-position x-header y-header");
                } else if (i >= 1 && i <= 12) {
                    elem.addClass("x-header");
                    //console.log(this.water_M[i - 1] + '月');
                    elem.text(this.water_M[i - 1]);
                } else if (i == 13 || i == 26 || i == 39) {
                    elem.addClass("y-header");
                    if (i === 13) elem.text('上旬');
                    if (i === 26) elem.text('中旬');
                    if (i === 39) elem.text('下旬');
                } else {
                    elem.addClass("TenDay");
                    elem.attr("Qval", '-');
                    if (i >= 14 && i <= 25) {
                        let index = 1 + (i - 14) * 3;
                        let TendayId = (index - 6) <= 0 ? (index - 6) + 36 : (index - 6);
                        console.log(index, TendayId);
                        elem.attr("index", index);
                        elem.attr("TendayId", TendayId);
                    } else if (i >= 27 && i <= 38) {
                        let index = 2 + (i - 27) * 3;
                        let TendayId = (index - 6) <= 0 ? (index - 6) + 36 : (index - 6);
                        elem.attr("index", index);
                        elem.attr("TendayId", TendayId);
                    } else if (i >= 40) {
                        let index = 3 + (i - 40) * 3;
                        let TendayId = (index - 6) <= 0 ? (index - 6) + 36 : (index - 6);
                        elem.attr("index", index);
                        elem.attr("TendayId", TendayId);
                    }
                }
            }
        }

        // Initialize selectionjs
        this.selection = Selection.create({
            class: 'selection',// Class for the selection-area
            selectables: [`div[caseNo = "${this.methodNo}"] .box-wrap > div`],// All elements in this container can be selected

            // The container is also the boundary in this case
            boundaries: [`div[caseNo = "${this.methodNo}"] .box-wrap`]
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

                //console.log(this.scope.find(el));
                if (!this.scope.find(el).hasClass('zero-position') && !$(el).hasClass('x-header') && !$(el).hasClass('y-header')) {
                    console.log(this.scope.find('#QGridValueSelection').val());
                    el.classList.remove(...el.classList);
                    el.classList.add('TenDay');
                    el.classList.add('selected');
                    el.classList.add(this.scope.find('#QGridValueSelection').val());
                    el.setAttribute("Qval", this.scope.find('#QGridValueSelection').val());
                    $(el).text(this.scope.find('#QGridValueSelection').val());
                }

            }

            // Remove the class from elements that where removed
            // since the last selection
            for (const el of removed) {
                if (!this.scope.find(el).hasClass('zero-position') && !$(el).hasClass('x-header') && !$(el).hasClass('y-header')) {
                    el.classList.remove(...el.classList);
                    el.classList.add('TenDay');
                    //el.setAttribute("Qval", 'Q80');
                    $(el).text('');
                }
            }

        }).on('stop', ({ inst }) => {
            inst.keepSelection();
        });
    }

    getGridSelectionVal(domin) {
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

    returnSelection() {
        return this.selection;
    }
}






