<template>
  <!-- Widget 1 -->
  <div class="flex flex-row sm12 lg2">
    <div class="widget h-full bg-white">
      <VaSkeleton variant="text" class="money-title" :lines="3" last-line-width="100%" />
    </div>
  </div>

  <!-- Widget 2 -->
  <div class="flex flex-row sm12 lg5">
    <div class="widget widget-second bg-white">
      <VaSkeleton variant="text" class="widget-title c-mb-12" />
      <div class="flex item-wrapper">
        <div class="item-first">
          <VaSkeleton variant="text" :lines="4" last-line-width="100%" />
        </div>
        <div class="item-second">
          <VaSkeleton variant="text" :lines="4" last-line-width="100%" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .widget {
    min-height: 120px;
    border-radius: 10px;
    padding: 17px 12px 12px 12px;
    .money-title {
      font-weight: 700;
      font-size: 30px;
    }
  }
  .widget-second {
    font-size: 14px;
    padding: 12px;
    .widget-title {
      font-weight: 700;
      color: #06152b;
    }
    .item-wrapper {
      padding: 0px !important;
      justify-content: space-between;
      font-size: 20px;
      display: flex;
    }
    .item-first {
      padding-right: 16px;
      border-right: 1px solid rgba(224, 224, 224, 0.5);
    }
    .item-second {
      padding-left: 16px;
    }
    .item-wrapper:first-child {
      padding: 30px;
    }
  }
</style>
