/*
* Agree component
*/
$(document).ready(() => {
    
    $('.agree-click').on('click', (e) => {
        let $block = $(e.currentTarget).parents('.agree');
        let $input = $block.find('input[type="hidden"]');
        let agreeId = $block.data('id');
        
        if ($input.val() === '') {
            $block.addClass('active');
            $input.val(1);
            
            if (agreeId) {
                $.cookie('agree-' + agreeId, true);
            }
        } else {
            $block.removeClass('active');
            $input.val('');

            if (agreeId) {
                $.removeCookie('agree-' + agreeId);
            }
        }
    });
    
    $('.agree').each((agreeIndex, agreeElement) => {
        const $block = $(agreeElement);
        let $input = $block.find('input[type="hidden"]');
        
        const agreeId = $block.data('id');
        const agreeCookieValue = $.cookie('agree-' + agreeId);
        
        if (agreeCookieValue === 'true' && !$block.hasClass('active')) {
            $block.addClass('active');
            $input.val(1);
        }
    });

});