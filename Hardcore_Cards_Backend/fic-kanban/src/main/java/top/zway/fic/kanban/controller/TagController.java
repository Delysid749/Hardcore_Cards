package top.zway.fic.kanban.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import top.zway.fic.base.entity.AO.TagAO;
import top.zway.fic.base.entity.DTO.TagDTO;
import top.zway.fic.base.result.R;
import top.zway.fic.kanban.service.TagService;
import top.zway.fic.web.exception.Jsr303Checker;
import top.zway.fic.web.holder.LoginUserHolder;

import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/kanban/tag")
public class TagController {
    private final LoginUserHolder loginUserHolder;
    private final TagService tagService;

    @PostMapping("")
    public R insertTag(@Valid @RequestBody TagDTO tagDTO, BindingResult bindingResult) {
        Jsr303Checker.check(bindingResult);
        Long id = loginUserHolder.getCurrentUser().getId();
        TagAO tagAo = new TagAO(tagDTO, id, 1);
        boolean success = tagService.insertTag(tagAo);
        return R.judge(success, "无权限新增");
    }

    @DeleteMapping("")
    public R deleteTag(Long tagId) {
        if (tagId == null) {
            return R.failed("路径错误");
        }
        Long id = loginUserHolder.getCurrentUser().getId();
        boolean success = tagService.deleteTag(tagId, id);
        return R.judge(success, "已被删除或无删除权限");
    }
}
