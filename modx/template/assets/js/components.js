/*
* Agree component
*/
$(document).ready(() => {
    
    $('.agree-click').on('click', (e) => {
        let $block = $(e.currentTarget).parents('.agree');
        let $input = $block.find('input[type="checkbox"]');
        let agreeId = $block.data('id');
        
        if ($input.is(':checked') === false) {
            $block.addClass('active');
            $input.val(1);
            $input.prop('checked', true);
            
            if (agreeId) {
                $.cookie('agree-' + agreeId, true);
            }
        } else {
            $block.removeClass('active');
            $input.val('');
            $input.prop('checked', false);

            if (agreeId) {
                $.removeCookie('agree-' + agreeId);
            }
        }
    });
    
    $('.agree').each((agreeI, agreeEl) => {
        const $block = $(agreeEl);
        let $input = $block.find('input[type="checkbox"]');
        
        const agreeId = $block.data('id');
        const agreeCookieValue = $.cookie('agree-' + agreeId);
        
        if (agreeCookieValue === 'true' && !$block.hasClass('active')) {
            $block.addClass('active');
            $input.val(1);
            $input.prop('checked', true);
        }
    });

});