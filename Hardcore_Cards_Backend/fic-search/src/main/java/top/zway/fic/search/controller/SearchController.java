package top.zway.fic.search.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.zway.fic.base.entity.BO.SearchUpdateBO;
import top.zway.fic.base.entity.VO.SearchVO;
import top.zway.fic.base.result.R;
import top.zway.fic.search.service.SearchService;
import top.zway.fic.web.holder.LoginUserHolder;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class SearchController {
    private final LoginUserHolder loginUserHolder;
    private final SearchService searchService;

    @GetMapping("/search")
    public R<List<SearchVO>> search(@RequestParam("key") String key) {
        Long id = loginUserHolder.getCurrentUser().getId();
        List<SearchVO> search = searchService.search(key, id);
        return R.success(search);
    }

    @GetMapping("/rpc/full/update")
    public R fullUpdate(Long kanbanId) {
        long start = System.currentTimeMillis();
        searchService.fullUpdate(kanbanId);
        log.info("全量更新{}耗时{}ms", kanbanId, System.currentTimeMillis() - start);
        return R.success();
    }
}
