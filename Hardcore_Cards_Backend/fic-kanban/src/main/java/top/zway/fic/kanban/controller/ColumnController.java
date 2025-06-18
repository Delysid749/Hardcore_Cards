package top.zway.fic.kanban.controller;


import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.Range;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import top.zway.fic.base.entity.AO.KanbanColumnAO;
import top.zway.fic.base.entity.DTO.KanbanColumnDTO;
import top.zway.fic.base.result.R;
import top.zway.fic.kanban.service.ColumnService;
import top.zway.fic.web.exception.Jsr303Checker;
import top.zway.fic.web.holder.LoginUserHolder;

import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/kanban/column")
public class ColumnController {
    private final LoginUserHolder loginUserHolder;
    private final ColumnService columnService;

    @PostMapping("")

    public R insertColumn(@Valid @RequestBody KanbanColumnDTO kanbanColumnDTO, BindingResult bindingResult) {
        Jsr303Checker.check(bindingResult);
        Long id = loginUserHolder.getCurrentUser().getId();
        KanbanColumnAO kanbanColumnAo = new KanbanColumnAO(kanbanColumnDTO, id);
        boolean success = columnService.insertColumn(kanbanColumnAo);
        return R.judge(success, "无权限操作此看板");
    }

    @DeleteMapping("")

    public R deleteColumn(@RequestParam("columnId") Long columnId) {
        if (columnId == null) {
            return R.failed("路径错误");
        }
        Long id = loginUserHolder.getCurrentUser().getId();
        boolean success = columnService.deleteColumn(columnId, id);
        return R.judge(success, "已被删除或无删除权限");
    }

    @PutMapping("")

    public R updateColumn(@Valid @RequestBody KanbanColumnDTO kanbanColumnDTO, BindingResult bindingResult) {
        Jsr303Checker.check(bindingResult);
        Long id = loginUserHolder.getCurrentUser().getId();
        KanbanColumnAO kanbanColumnAo = new KanbanColumnAO(kanbanColumnDTO, id);
        boolean success = columnService.updateColumn(kanbanColumnAo);
        return R.judge(success, "已被删除或无修改权限");
    }

    @PutMapping("/order")

    public R moveColumn(@RequestParam("move") Integer move, @RequestParam("columnId") Long columnId) {
        if (move == null || move == 0 || columnId == 0) {
            return R.failed("参数错误");
        }
        Long id = loginUserHolder.getCurrentUser().getId();
        boolean success = columnService.moveColumn(move, columnId, id);
        return R.judge(success, "移动失败");
    }
}
